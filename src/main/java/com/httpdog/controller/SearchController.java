package com.httpdog.controller;

import com.httpdog.model.User;
import com.httpdog.model.UserSearch;
import com.httpdog.repository.UserSearchRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    private static final List<Map<String, String>> HTTP_CODES = new ArrayList<>();

    static {
        String[][] codes = {
            {"100", "Continue"}, {"101", "Switching Protocols"}, {"102", "Processing"}, {"103", "Early Hints"},
            {"200", "OK"}, {"201", "Created"}, {"202", "Accepted"}, {"203", "Non-Authoritative Information"},
            {"204", "No Content"}, {"205", "Reset Content"}, {"206", "Partial Content"}, {"207", "Multi-Status"},
            {"208", "Already Reported"}, {"226", "IM Used"},
            {"300", "Multiple Choices"}, {"301", "Moved Permanently"}, {"302", "Found"}, {"303", "See Other"},
            {"304", "Not Modified"}, {"305", "Use Proxy"}, {"307", "Temporary Redirect"}, {"308", "Permanent Redirect"},
            {"400", "Bad Request"}, {"401", "Unauthorized"}, {"402", "Payment Required"}, {"403", "Forbidden"},
            {"404", "Not Found"}, {"405", "Method Not Allowed"}, {"406", "Not Acceptable"}, {"407", "Proxy Authentication Required"},
            {"408", "Request Timeout"}, {"409", "Conflict"}, {"410", "Gone"}, {"411", "Length Required"},
            {"412", "Precondition Failed"}, {"413", "Payload Too Large"}, {"414", "URI Too Long"}, {"415", "Unsupported Media Type"},
            {"416", "Range Not Satisfiable"}, {"417", "Expectation Failed"}, {"418", "I'm a teapot"}, {"421", "Misdirected Request"},
            {"422", "Unprocessable Entity"}, {"423", "Locked"}, {"424", "Failed Dependency"}, {"425", "Too Early"},
            {"426", "Upgrade Required"}, {"428", "Precondition Required"}, {"429", "Too Many Requests"},
            {"431", "Request Header Fields Too Large"}, {"451", "Unavailable For Legal Reasons"},
            {"500", "Internal Server Error"}, {"501", "Not Implemented"}, {"502", "Bad Gateway"}, {"503", "Service Unavailable"},
            {"504", "Gateway Timeout"}, {"505", "HTTP Version Not Supported"}, {"506", "Variant Also Negotiates"},
            {"507", "Insufficient Storage"}, {"508", "Loop Detected"},{"509", "Bandwidth Limit Exceeded"}, {"510", "Not Extended"}, {"511", "Network Authentication Required"},
            {"520", "Web server is returning an unknown error"},{"521", "Web server is down"},{"522", "Connection timed out"},
            {"523", "Origin is unreachable"},{"524", "A Timeout Occurred"},
            {"525", "SSL handshake failed"},{"526", "Invalid SSL certificate"},
            {"527", "Railgun Listener to Origin"},{"529", "The service is overloaded"},
            {"530", "Site Frozen"},{"561", "Unauthorized"},
            {"598", "Network read timeout error"},{"599", "Network Connect Timeout Error"},{"999", "Request Denied"}
        };
        for (String[] c : codes) HTTP_CODES.add(create(c[0], c[1]));
    }

    private static Map<String, String> create(String code, String desc) {
        Map<String, String> map = new HashMap<>();
        map.put("code", code);
        map.put("description", desc);
        return map;
    }

    @Autowired
    private UserSearchRepository userSearchRepository;

    @GetMapping
    public ResponseEntity<?> search(
            @RequestParam String code,
            @AuthenticationPrincipal User user) {

        // Save the search if user is authenticated
        if (user != null) {
            UserSearch searchEntry = new UserSearch();
            searchEntry.setSearchQuery(code);
            searchEntry.setUser(user);
            userSearchRepository.save(searchEntry);
        } else {
            // Option 1: throw error if user is required to save searches
            // throw new IllegalStateException("User must be logged in to save search queries.");

            // Option 2: silently skip saving if no user (uncomment if preferred)
            // Do nothing here

            // For example, let's do nothing to allow anonymous search without saving
        }

        // Replace 'x' with digit regex to support patterns like "4xx"
        String regex = code.replaceAll("x", "\\\\d");
        Pattern pattern = Pattern.compile("^" + regex + "$", Pattern.CASE_INSENSITIVE);

        List<Map<String, String>> results = HTTP_CODES.stream()
            .filter(item -> pattern.matcher(item.get("code")).matches())
            .map(item -> {
                Map<String, String> result = new HashMap<>(item);
                result.put("imageUrl", "https://http.dog/" + item.get("code") + ".jpg");
                return result;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }
}

