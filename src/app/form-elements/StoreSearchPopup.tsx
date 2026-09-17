import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';

export interface Props {
    onSelectStore?: (id: number, name: string) => void;
}

export interface StoreInfo {
    storeId: number;
    userId: string;
    storeNm: string;
    storeAddr: string;
}

interface StoreResponse {
    data: {
        items: StoreInfo[];
        totalCount: number;
    };
}

interface SearchFilter {
    type: 'nm' | 'addr';
    keyword: string;
}

const ITEMS_PER_PAGE = 10;
const PAGE_GROUP_SIZE = 5;

const StoreSearchPopup: React.FC<Props> = ({onSelectStore}) => {
    const [searchType, setSearchType] = useState<SearchFilter['type']>('nm');
    const [keyword, setKeyword] = useState('');
    const [activeFilter, setActiveFilter] = useState<SearchFilter>({type: 'nm', keyword: ''});
    const [stores, setStores] = useState<StoreInfo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const fetchStores = useCallback(async (page: number, filter: SearchFilter) => {
        setIsLoading(true);
        setHasError(false);

        try {
            const response = await axios.get<StoreResponse>(`${process.env.REACT_APP_API_URL}/store/search`, {
                params: {
                    page,
                    size: ITEMS_PER_PAGE,
                    type: filter.type,
                    keyword: filter.keyword
                }
            });
            const responseData = response.data.data;
            setStores(responseData?.items || []);
            setTotalCount(responseData?.totalCount || 0);
        } catch (error) {
            console.error('지점 검색 결과를 불러오지 못했습니다.', error);
            setStores([]);
            setTotalCount(0);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStores(currentPage, activeFilter);
    }, [currentPage, activeFilter, fetchStores]);

    const handleSearch = (event?: React.FormEvent) => {
        event?.preventDefault();
        setCurrentPage(1);
        setActiveFilter({type: searchType, keyword: keyword.trim()});
    };

    const handleClear = () => {
        setKeyword('');
        setCurrentPage(1);
        setActiveFilter({type: searchType, keyword: ''});
    };

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const currentGroup = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE);
    const startPage = currentGroup * PAGE_GROUP_SIZE + 1;
    const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);
    const pageNumbers = Array.from(
        {length: Math.max(endPage - startPage + 1, 0)},
        (_, index) => startPage + index
    );

    return (
        <div className="store-search-panel">
            <div className="store-search-intro">
                <span className="store-search-intro-icon" aria-hidden="true"><i className="mdi mdi-map-marker-radius" /></span>
                <div>
                    <strong>근무할 지점을 찾아보세요.</strong>
                    <p>지점명 또는 주소로 검색한 뒤 원하는 지점을 선택해 주세요.</p>
                </div>
            </div>

            <form className="store-search-form" onSubmit={handleSearch}>
                <div className="store-search-tabs" role="tablist" aria-label="검색 기준">
                    <button
                        className={searchType === 'nm' ? 'is-active' : ''}
                        type="button"
                        role="tab"
                        aria-selected={searchType === 'nm'}
                        onClick={() => setSearchType('nm')}
                    >
                        <i className="mdi mdi-store" aria-hidden="true" />지점명
                    </button>
                    <button
                        className={searchType === 'addr' ? 'is-active' : ''}
                        type="button"
                        role="tab"
                        aria-selected={searchType === 'addr'}
                        onClick={() => setSearchType('addr')}
                    >
                        <i className="mdi mdi-map-marker" aria-hidden="true" />주소
                    </button>
                </div>

                <div className="store-search-input-row">
                    <div className="store-search-input">
                        <i className="mdi mdi-magnify" aria-hidden="true" />
                        <input
                            type="search"
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            placeholder={searchType === 'nm' ? '지점명을 입력하세요' : '도로명 또는 지역을 입력하세요'}
                            aria-label={searchType === 'nm' ? '지점명 검색어' : '주소 검색어'}
                        />
                        {keyword && (
                            <button type="button" aria-label="검색어 지우기" onClick={handleClear}>
                                <i className="mdi mdi-close-circle" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                    <button className="store-search-submit" type="submit">
                        검색하기
                        <i className="mdi mdi-arrow-right" aria-hidden="true" />
                    </button>
                </div>
            </form>

            <div className="store-search-result-head">
                <div>
                    <span>검색 결과</span>
                    <strong>{totalCount.toLocaleString()}</strong>
                </div>
                {activeFilter.keyword && (
                    <span className="store-search-keyword">‘{activeFilter.keyword}’ 검색</span>
                )}
            </div>

            <div className={`store-search-results ${isLoading ? 'is-loading' : ''}`}>
                {isLoading ? (
                    <div className="store-search-state">
                        <span className="store-search-spinner" />
                        <strong>지점을 찾고 있어요.</strong>
                        <p>잠시만 기다려 주세요.</p>
                    </div>
                ) : hasError ? (
                    <div className="store-search-state is-error">
                        <span><i className="mdi mdi-alert-circle-outline" /></span>
                        <strong>검색 결과를 불러오지 못했어요.</strong>
                        <p>잠시 후 다시 검색해 주세요.</p>
                        <button type="button" onClick={() => fetchStores(currentPage, activeFilter)}>다시 시도</button>
                    </div>
                ) : stores.length > 0 ? (
                    stores.map((store, index) => (
                        <button
                            className="store-result-card"
                            type="button"
                            key={store.storeId || index}
                            onClick={() => onSelectStore?.(store.storeId, store.storeNm)}
                        >
                            <span className="store-result-number">
                                {String((currentPage - 1) * ITEMS_PER_PAGE + index + 1).padStart(2, '0')}
                            </span>
                            <span className="store-result-icon" aria-hidden="true"><i className="mdi mdi-storefront" /></span>
                            <span className="store-result-copy">
                                <strong>{store.storeNm}</strong>
                                <small><i className="mdi mdi-map-marker-outline" />{store.storeAddr || '등록된 주소가 없습니다.'}</small>
                            </span>
                            <span className="store-result-select">
                                선택 <i className="mdi mdi-chevron-right" />
                            </span>
                        </button>
                    ))
                ) : (
                    <div className="store-search-state">
                        <span><i className="mdi mdi-store-search-outline" /></span>
                        <strong>검색 결과가 없어요.</strong>
                        <p>검색어를 줄이거나 다른 주소로 다시 찾아보세요.</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && !isLoading && (
                <nav className="store-search-pagination" aria-label="지점 검색 페이지">
                    <button type="button" aria-label="첫 페이지" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                        <i className="mdi mdi-page-first" />
                    </button>
                    <button type="button" aria-label="이전 페이지 묶음" onClick={() => setCurrentPage(Math.max(startPage - 1, 1))} disabled={startPage === 1}>
                        <i className="mdi mdi-chevron-left" />
                    </button>
                    {pageNumbers.map(page => (
                        <button
                            className={page === currentPage ? 'is-active' : ''}
                            type="button"
                            key={page}
                            aria-current={page === currentPage ? 'page' : undefined}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button type="button" aria-label="다음 페이지 묶음" onClick={() => setCurrentPage(Math.min(endPage + 1, totalPages))} disabled={endPage === totalPages}>
                        <i className="mdi mdi-chevron-right" />
                    </button>
                    <button type="button" aria-label="마지막 페이지" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                        <i className="mdi mdi-page-last" />
                    </button>
                </nav>
            )}
        </div>
    );
};

export default StoreSearchPopup;
