import { useState, useEffect, useMemo } from 'react';

/**
 * Hook personnalisé pour la pagination
 * @param {Array} items - Liste des éléments à paginer
 * @param {number} itemsPerPage - Nombre d'éléments par page
 */
export const usePagination = (items, itemsPerPage = 20) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState([]);

  // Calcul du nombre total de pages
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Items de la page actuelle
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Reset la page quand les items changent
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedItems([]);
  }, [items]);

  // Met à jour les items affichés
  useEffect(() => {
    if (currentPage === 1) {
      setDisplayedItems(currentItems);
    } else {
      setDisplayedItems(prev => [...prev, ...currentItems]);
    }
  }, [currentItems, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const loadMore = () => {
    nextPage();
  };

  const hasMore = currentPage < totalPages;

  return {
    displayedItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    loadMore,
    hasMore,
    totalItems: items.length
  };
};