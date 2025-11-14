package com.packt.readingjournal;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.packt.readingjournal.domain.AppUser;
import com.packt.readingjournal.domain.AppUserRepository;
import com.packt.readingjournal.domain.Book;
import com.packt.readingjournal.domain.BookRepository;
import com.packt.readingjournal.domain.ReadingEntry;
import com.packt.readingjournal.domain.ReadingEntryRepository;
import com.packt.readingjournal.domain.ReadingStatus;

import jakarta.transaction.Transactional;

@SpringBootApplication
public class ReadingjournalApplication implements CommandLineRunner{
	private static final Logger logger = LoggerFactory.getLogger(ReadingjournalApplication.class);
	private final AppUserRepository appUserRepository;
	private final BookRepository bookRepository;
	private final ReadingEntryRepository readingEntryRepository;
	
	public ReadingjournalApplication(AppUserRepository appUserRepository, BookRepository bookRepository, ReadingEntryRepository readingEntryRepository) {
		this.appUserRepository = appUserRepository;
		this.bookRepository = bookRepository;
		this.readingEntryRepository = readingEntryRepository;
	}
	
	public static void main(String[] args) {
		SpringApplication.run(ReadingjournalApplication.class, args);
		logger.info("Application started");
	}

	@Override
	@Transactional
	public void run(String... args) throws Exception {
		Book book1 = new Book("Sophiechen und der Riese", "Roald Dahl", 
				"Der gute Riese GuRie pustet den Menschenkindern mit einer Trompete schöne Träume in die Schlafzimmer – bis Sophiechen ihn eines Nachts dabei entdeckt. Kurzerhand nimmt sie der GuRie mit ins Riesenland, wo nicht alle Riesen so nett sind wie er.",
				"9783644567610, 3644567611", "http://books.google.com/books/content?id=_Mo4CwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api");
		Book book2 = new Book("Harry Potter und der Stein der Weisen", "J.K. Rowling",
				"Bis zu seinem elften Geburtstag glaubt Harry, er sei ein ganz normaler Junge. Doch dann erfährt er, dass er sich an der Schule für Hexerei und Zauberei einfinden soll – denn er ist ein Zauberer! In Hogwarts stürzt Harry von einem Abenteuer ins nächste und muss gegen Bestien, Mitschüler und Fabelwesen kämpfen. ",
				"9783551320117, 355132011X", "http://books.google.com/books/content?id=XtekEncdTZcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api");

		Book book5 = new Book("Harry Potter 4 und der Stein der Weisen", "J.K. Rowling",
				"Bis zu seinem elften Geburtstag glaubt Harry, er sei ein ganz normaler Junge. Doch dann erfährt er, dass er sich an der Schule für Hexerei und Zauberei einfinden soll – denn er ist ein Zauberer! In Hogwarts stürzt Harry von einem Abenteuer ins nächste und muss gegen Bestien, Mitschüler und Fabelwesen kämpfen. ",
				"9783551320117, 355132011X", "http://books.google.com/books/content?id=XtekEncdTZcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api");
		bookRepository.saveAll(Arrays.asList(book1, book2, book5));
		AppUser user1 = new AppUser("user", "$2a$10$.NH6C7oHRQC26IeXlksKM.ZwxvvCwAbZokRFoV5tE1o0a7RWxhK8u", "USER");
		AppUser user2 = new AppUser("user2", "$2a$10$.NH6C7oHRQC26IeXlksKM.ZwxvvCwAbZokRFoV5tE1o0a7RWxhK8u", "USER");
		
		appUserRepository.save(user1);
		appUserRepository.save(user2);
		appUserRepository.save(new AppUser("admin", "$2a$10$hVsXl9CVMuhRLznA.haUy.Zv4cLvrUj.GRbc7I2RjCYE5v6dJgBKi", "ADMIN"));
		
		readingEntryRepository.save(new ReadingEntry(user1, book1, ReadingStatus.PLANNED, 0, "Sehr gut", null, null));
		readingEntryRepository.save(new ReadingEntry(user1, book2, ReadingStatus.PLANNED, 0, "Nicht interesant", null, null));
		readingEntryRepository.save(new ReadingEntry(user2, book5, ReadingStatus.PLANNED, 0, "Nicht interesant2", null, null));
		
		for(ReadingEntry readingEntry:readingEntryRepository.findAll()) {
			logger.info("book: {}, user: {}", readingEntry.getBook().getAuthor(), readingEntry.getUser().getUsername());
		}
	}
}
