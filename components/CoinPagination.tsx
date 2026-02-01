'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useRouter } from 'next/navigation'
import { buildPageNumbers, cn, ELLIPSIS } from '@/lib/utils';

const CoinPagination = ({ currentPage, totalPages, hasMorePages }: Pagination) => {

    const router = useRouter();

    const handlePageChange = (page: number) => {
        router.push(`/coins?page=${page}`);
    }

    const pageNumbers = buildPageNumbers(currentPage, totalPages);
    const islastPage = !hasMorePages || currentPage === totalPages;
  return (
   <Pagination id="coin-pagination" >
  <PaginationContent className="pagination-content">
    <PaginationItem className='pagination-control prev'>
      <PaginationPrevious onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} className={currentPage === 1 ? 'control-disabled' : 'control-button'} />
    </PaginationItem>

    <div className='pagination-pages flex'>
    {pageNumbers.map((page, index) => (
  <PaginationItem key={index}>
    {page === ELLIPSIS ? (
      <span className="ellipsis">...</span>
    ) : (
      <PaginationLink
        onClick={() => handlePageChange(page)}
        className={cn(
          'page-link',
          page === currentPage && 'page-link-active'
        )}
      >
        {page}
      </PaginationLink>
    )}
  </PaginationItem>
))}

    </div>
   
   

    <PaginationItem className='pagination-control next'>
      <PaginationNext onClick={() => !islastPage && handlePageChange(currentPage + 1)} className={islastPage ? 'control-disabled' : 'control-button'} />
    </PaginationItem>
  </PaginationContent>
</Pagination>
  )
}

export default CoinPagination
