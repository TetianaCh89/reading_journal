package com.packt.readingjournal.domain;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ReadingEntryRepository  extends CrudRepository<ReadingEntry, Long>{
    List<ReadingEntry> findByUser(AppUser user);
    
    List<ReadingEntry> findByUserUsername(@Param("username") String username);


    List<ReadingEntry> findByBook(Book book);

    List<ReadingEntry> findByStatus(ReadingStatus status);

    List<ReadingEntry> findByUserAndStatus(AppUser user, ReadingStatus status);
}