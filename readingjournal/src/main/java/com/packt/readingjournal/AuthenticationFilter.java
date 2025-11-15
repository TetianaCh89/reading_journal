package com.packt.readingjournal;

import java.io.IOException;
import java.util.Collections;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import com.packt.readingjournal.service.JwtService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {
	private final JwtService jwtService;
	
	public AuthenticationFilter(JwtService jwtService) {
		this.jwtService = jwtService;
	}
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	        throws ServletException, IOException {

	    HttpServletRequest requestToUse = request;


	    if (request.getServletPath().equals("/api/login") && request.getMethod().equalsIgnoreCase("POST")) {
	        requestToUse = new ContentCachingRequestWrapper(request);
	    }

	    String jws = requestToUse.getHeader(HttpHeaders.AUTHORIZATION);
	    if (jws != null) {
	        String user = jwtService.getAuthUser(requestToUse);
	        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
	        SecurityContextHolder.getContext().setAuthentication(authentication);
	    }

	    filterChain.doFilter(requestToUse, response);
	}


}
