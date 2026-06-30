// SisCom_Springboot/src/main/java/br/gov/siscom/audit/AuditFilter.java
package br.gov.siscom.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AuditFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger("AUDIT");
    private static final Logger requestLogger = LoggerFactory.getLogger("REQUEST");
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        long startTime = System.currentTimeMillis();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();

        try {
            // Passa pro próximo filter (incluindo SecurityFilter)
            filterChain.doFilter(request, response);
            
            // AGORA o SecurityFilter já executou, então temos a autenticação!
            long duration = System.currentTimeMillis() - startTime;
            String user = getAuthenticatedUser();
            int status = response.getStatus();
            
            // Log para operações sensíveis
            if (isOperationSensitive(method, uri)) {
                logger.info("AUDIT SUCCESS | User: {} | Method: {} | URI: {} | Status: {} | Duration: {}ms",
                    user, method, uri, status, duration);
            }
            
            // Log geral
            requestLogger.debug("Request | User: {} | {} {} | Status: {} | Duration: {}ms",
                user, method, uri, status, duration);
                
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            String user = getAuthenticatedUser();
            
            logger.error("AUDIT FAILED | User: {} | Method: {} | URI: {} | Error: {} | Duration: {}ms",
                user, method, uri, e.getMessage(), duration);
            throw e;
        }
    }
    
    private String getAuthenticatedUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                return auth.getName();
            }
            return "ANONYMOUS";
        } catch (Exception e) {
            return "UNKNOWN";
        }
    }
    
    private boolean isOperationSensitive(String method, String uri) {
        return method.equalsIgnoreCase("DELETE") || 
               method.equalsIgnoreCase("POST") || 
               method.equalsIgnoreCase("PUT") ||
               method.equalsIgnoreCase("PATCH")||
               uri.contains("/messages")||
               uri.contains("/chat");
    }
}