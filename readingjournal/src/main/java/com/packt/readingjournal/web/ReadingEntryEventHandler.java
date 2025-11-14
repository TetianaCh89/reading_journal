package com.packt.readingjournal.web;

import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.packt.readingjournal.domain.AppUser;
import com.packt.readingjournal.domain.AppUserRepository;
import com.packt.readingjournal.domain.Book;
import com.packt.readingjournal.domain.BookRepository;
import com.packt.readingjournal.domain.ReadingEntry;

@Component
@RepositoryEventHandler(ReadingEntry.class)
public class ReadingEntryEventHandler {

    private final AppUserRepository userRepository;
    private final BookRepository bookRepository;

    public ReadingEntryEventHandler(AppUserRepository userRepository, BookRepository bookRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @HandleBeforeCreate
    public void handleBeforeCreate(ReadingEntry entry) {
    	
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new RuntimeException("User not authenticated");
        }

        String username = authentication.getName();
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        entry.setUser(user);
    }
}