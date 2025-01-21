package com.griflet.eventure.user;

import com.griflet.eventure.search.SearchCriteria;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;
    private ModelMapper modelMapper;

    @GetMapping("/me")
    public UserDTO me(Principal principal) {
        User byEmail = userService.findById(principal.getName()).orElse(null);
        return modelMapper.map(byEmail, UserDTO.class);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable String id) {
        Optional<User> entity = userService.findById(id);
        return entity.map(e -> ResponseEntity.ok(modelMapper.map(e, UserDTO.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping()
    public List<UserDTO> getAll() {
        List<User> entity = userService.findAll();
        return entity.stream().map(e -> modelMapper.map(e, UserDTO.class)).toList();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable String id, @RequestBody UserDTO dto) {
        User updatedEntity = userService.update(id, dto);
        return ResponseEntity.ok(modelMapper.map(updatedEntity, UserDTO.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody UserDTO dto) {
        User savedEntity = userService.save(dto);
        return ResponseEntity.ok(modelMapper.map(savedEntity, UserDTO.class));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserDTO>> searchUsers(
            @Parameter(description = "Name to search for") @RequestParam(required = false) List<SearchCriteria> searchCriteria,
            @Parameter(description = "Pagination parameters") Pageable pageable) {
        Page<User> users = userService.search(searchCriteria, pageable);
        Page<UserDTO> userDTOs = users.map(user -> modelMapper.map(user, UserDTO.class));
        return ResponseEntity.ok(userDTOs);
    }
}
