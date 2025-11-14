package com.packt.readingjournal.web;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.packt.readingjournal.domain.AppUser;
import com.packt.readingjournal.domain.AppUserRepository;
import com.packt.readingjournal.domain.ReadingEntry;
import com.packt.readingjournal.domain.ReadingEntryRepository;

@RestController
//@RequestMapping("/api")
public class ReadingEntryController {
	private final ReadingEntryRepository readingEntryRepository;
	private final AppUserRepository appUserRepository;
	
	public ReadingEntryController(ReadingEntryRepository readingEntryRepository, AppUserRepository appUserRepository) {
		this.appUserRepository = appUserRepository;
		this.readingEntryRepository = readingEntryRepository;
	}
	
	@PostMapping("/readingEntries")
	public ResponseEntity<ReadingEntry> createReadingEntry(
	        @RequestBody ReadingEntry entry,
	        Authentication authentication) {
	    String username = authentication.getName();
	    AppUser user = appUserRepository.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));
	    entry.setUser(user);

	    ReadingEntry saved = readingEntryRepository.save(entry);
	    return ResponseEntity.ok(saved);
	}
}
