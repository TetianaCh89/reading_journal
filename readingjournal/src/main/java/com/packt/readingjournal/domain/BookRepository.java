package com.packt.readingjournal.domain;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface BookRepository extends CrudRepository<Book, Long>{
	List<Book> findByIsbn(String isbn);
	List<Book> findByTitle(String title);
    List<Book> findByTitleContainingIgnoreCase(@Param("title") String title);
}
