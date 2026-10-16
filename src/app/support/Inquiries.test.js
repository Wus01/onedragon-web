import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import Inquiries from './Inquiries';
import { createInquiry, getMyInquiries } from '../../api/inquiryApi';

jest.mock('../../api/inquiryApi', () => ({
  createInquiry: jest.fn(),
  getMyInquiries: jest.fn(),
}));

const emptyPage = { items: [], page: 0, totalPages: 0, totalElements: 0 };
let container;

beforeEach(() => {
  jest.resetAllMocks();
  getMyInquiries.mockResolvedValue(emptyPage);
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

async function renderPage() {
  await act(async () => {
    ReactDOM.render(<MemoryRouter><Inquiries /></MemoryRouter>, container);
  });
}

function fillForm(title = '로그인 문의', content = '문제가 발생했습니다.\n확인 부탁드립니다.') {
  act(() => {
    Simulate.change(container.querySelector('#inquiry-title'), { target: { value: title } });
    Simulate.change(container.querySelector('#inquiry-content'), { target: { value: content } });
  });
}

test('successful submission sends only title and content, clears form and refreshes history', async () => {
  createInquiry.mockResolvedValue({ inquiryNo: 7 });
  await renderPage();
  fillForm();
  await act(async () => { Simulate.submit(container.querySelector('form')); });

  expect(createInquiry).toHaveBeenCalledWith('로그인 문의', '문제가 발생했습니다.\n확인 부탁드립니다.');
  expect(container.querySelector('#inquiry-title').value).toBe('');
  expect(container.querySelector('#inquiry-content').value).toBe('');
  expect(container.textContent).toContain('접수번호: 7');
  expect(getMyInquiries).toHaveBeenCalledTimes(2);
});

test('failed submission keeps the draft and allows retry', async () => {
  createInquiry.mockRejectedValue(new Error('network failure'));
  await renderPage();
  fillForm();
  await act(async () => { Simulate.submit(container.querySelector('form')); });

  expect(container.querySelector('#inquiry-title').value).toBe('로그인 문의');
  expect(container.querySelector('#inquiry-content').value).toContain('문제가 발생했습니다.');
  expect(container.querySelector('[role="alert"]').textContent).toContain('접수하지 못했습니다');
  expect(container.querySelector('button[type="submit"]').disabled).toBe(false);
});

test('rejects whitespace-only content without sending a request', async () => {
  await renderPage();
  fillForm(' ', '   ');
  await act(async () => { Simulate.submit(container.querySelector('form')); });
  expect(createInquiry).not.toHaveBeenCalled();
  expect(container.querySelector('[role="alert"]').textContent).toContain('제목과 내용을 모두');
});

test('repeated submissions while pending send only one request', async () => {
  let finish;
  createInquiry.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
  await renderPage();
  fillForm();
  act(() => {
    Simulate.submit(container.querySelector('form'));
    Simulate.submit(container.querySelector('form'));
  });
  expect(createInquiry).toHaveBeenCalledTimes(1);
  expect(container.querySelector('button[type="submit"]').disabled).toBe(true);
  await act(async () => { finish({ inquiryNo: 8 }); });
});

test('failed history load offers a retry without affecting the form', async () => {
  getMyInquiries.mockRejectedValueOnce(new Error('network failure'));
  await renderPage();
  fillForm('작성 중', '작성 중인 내용');
  const retry = Array.from(container.querySelectorAll('button')).find((button) => button.textContent === '다시 불러오기');
  await act(async () => { Simulate.click(retry); });
  expect(getMyInquiries).toHaveBeenCalledTimes(2);
  expect(container.textContent).toContain('아직 접수한 문의가 없습니다');
  expect(container.querySelector('#inquiry-title').value).toBe('작성 중');
});

test('history renders content as text and requests the next page', async () => {
  const inquiry = { inquiryNo: 1, title: '문의 제목', content: '<script>alert(1)</script>', createdAt: '2026-10-17T00:00:00Z' };
  getMyInquiries.mockResolvedValueOnce({ items: [inquiry], page: 0, totalPages: 2, totalElements: 11 })
    .mockResolvedValueOnce({ items: [inquiry], page: 1, totalPages: 2, totalElements: 11 });
  await renderPage();
  expect(container.querySelector('script')).toBeNull();
  expect(container.textContent).toContain('<script>alert(1)</script>');
  const next = Array.from(container.querySelectorAll('button')).find((button) => button.textContent === '다음');
  await act(async () => { Simulate.click(next); });
  expect(getMyInquiries).toHaveBeenLastCalledWith(1);
  expect(container.querySelector('.inquiries-pagination').textContent).toContain('2 / 2');
});
