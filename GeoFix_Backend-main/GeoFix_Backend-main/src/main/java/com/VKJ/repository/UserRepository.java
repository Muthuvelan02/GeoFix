package com.VKJ.repository;

import com.VKJ.entity.User;
import com.VKJ.enums.Role;
import com.VKJ.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
    List<User> findByRolesContaining(Role role);
    List<User> findByRolesContainingAndStatus(Role role, UserStatus status);

    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin >= :startOfWeek")
    int countWeeklyUsers(@Param("startOfWeek") LocalDateTime startOfWeek);

    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin >= :startOfMonth")
    int countMonthlyUsers(@Param("startOfMonth") LocalDateTime startOfMonth);

    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin >= :startDate AND u.lastLogin <= :endDate")
    int countUsersBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(u) FROM User u WHERE :role MEMBER OF u.roles AND u.status = :status")
    int countByRolesContainingAndStatus(@Param("role") Role role, @Param("status") UserStatus status);
}