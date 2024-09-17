import { Pagination } from '../../../components/general/general.types';

export const calculatePagination = (pageNumber: number, pageSize: number, total: number): Pagination => {
  const isBeyondTotal = (pageNumber - 1) * pageSize > total || !total;

  const from = isBeyondTotal ? 0 : (pageNumber - 1) * pageSize + 1;
  const to = isBeyondTotal ? 0 : Math.min(pageNumber * pageSize, total);
  const currentPage = pageNumber;
  const lastPage = Math.ceil(total / pageSize);

  return { from, to, total, pageSize, currentPage, lastPage };
};

export const resolveSkipAndLimitFromPagination = (pagination: Pagination) => {
  const skip = pagination.from <= 0 ? 0 : pagination.from - 1;
  const limit = pagination.to <= 0 ? 0 : pagination.pageSize;

  return { skip, limit };
};
