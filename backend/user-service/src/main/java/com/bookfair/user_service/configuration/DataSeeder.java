package com.bookfair.user_service.configuration;

import com.bookfair.user_service.entity.StallUserEntity;
import com.bookfair.user_service.enums.UserProfession;
import com.bookfair.user_service.repository.StallUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder {

  private final StallUserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @EventListener(ApplicationReadyEvent.class)
  public void seedAdminUser() {
    try {
      userRepository.findByUsername("srms0763@gmail.com").orElseGet(() -> {
        StallUserEntity admin = new StallUserEntity();
        admin.setUsername("srms0763@gmail.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setEnabled(true);
        admin.setPhoneNumber("0773698523");
        admin.setProfession(UserProfession.ADMIN);
        return userRepository.save(admin);
      });
      System.out.println("✅ Admin user ensured in DB.");
    } catch (Exception e) {
      System.err.println("⚠️ Seeder failed: " + e.getMessage());
    }
  }
}
