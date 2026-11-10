/** Keeps a page number inside the range the server reports, so an emptied last page never strands the user. */
export function clampPage(page: number, totalPages: number | undefined) {
  return totalPages !== undefined && totalPages >= 1 && page > totalPages ? totalPages : page
}
