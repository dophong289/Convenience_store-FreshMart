package com.freshmart.backend.service;

import com.freshmart.backend.exception.ResourceNotFoundException;
import com.freshmart.backend.model.User;
import com.freshmart.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
    
    @Transactional(readOnly = true)
    public User getUserByPhone(String phone) {
        return userRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with phone: " + phone));
    }
    
    @Transactional
    public User createUser(User user) {
        // Check if email or phone already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.existsByPhone(user.getPhone())) {
            throw new IllegalArgumentException("Phone already exists");
        }
        
        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }
    
    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        user.setName(userDetails.getName());
        user.setPhone(userDetails.getPhone());
        
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        
        return userRepository.save(user);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
    
    @Transactional
    public User addToWishlist(Long userId, Long productId) {
        User user = getUserById(userId);
        
        if (!user.getWishlist().contains(productId)) {
            user.getWishlist().add(productId);
            return userRepository.save(user);
        }
        
        return user;
    }
    
    @Transactional
    public User removeFromWishlist(Long userId, Long productId) {
        User user = getUserById(userId);
        user.getWishlist().remove(productId);
        return userRepository.save(user);
    }
    
    @Transactional
    public User addPoints(Long userId, Integer points) {
        User user = getUserById(userId);
        user.setPoints(user.getPoints() + points);
        
        // Update membership tier based on points
        if (user.getPoints() >= 10000) {
            user.setMembershipTier(User.MembershipTier.PLATINUM);
        } else if (user.getPoints() >= 5000) {
            user.setMembershipTier(User.MembershipTier.GOLD);
        } else if (user.getPoints() >= 2000) {
            user.setMembershipTier(User.MembershipTier.SILVER);
        }
        
        return userRepository.save(user);
    }
}

