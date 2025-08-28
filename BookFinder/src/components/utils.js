// export function getCoverUrl(book, size = 'M') {
//   if (book.cover_i) {
//     return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
//   }
//   if (book.isbn && book.isbn[0]) {
//     return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-${size}.jpg`;
//   }
//   // ✅ fallback placeholder (no more black boxes)
//   return `https://via.placeholder.com/150x220.png?text=No+Cover`;
// }

// export function getBookUrl(book) {
//   return book.key ? `https://openlibrary.org${book.key}` : null;
// }


export function getCoverUrl(book, size = "M") {
  if (book.cover_i) {
    return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
  }
  if (book.isbn && book.isbn[0]) {
    return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-${size}.jpg`;
  }
  if (book.cover_edition_key) {
    return `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-${size}.jpg`;
  }
  if (book.edition_key && book.edition_key[0]) {
    return `https://covers.openlibrary.org/b/olid/${book.edition_key[0]}-${size}.jpg`;
  }
  return null;
}

export function getBookUrl(book) {
  return book.key ? `https://openlibrary.org${book.key}` : null;
}