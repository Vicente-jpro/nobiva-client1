package com.nobiva.api.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import com.nobiva.api.domain.entities.messages.ClientMessage;
import com.nobiva.api.domain.entities.messages.MessageStatus;

import jakarta.persistence.LockModeType;

public interface ClientMessageRepository extends JpaRepository<ClientMessage, UUID> {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from ClientMessage m where m.createdAt < :cutoff and m.status in :statuses")
    int deleteExpiredTerminalMessages(@Param("cutoff") LocalDateTime cutoff,
                                      @Param("statuses") List<MessageStatus> statuses);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from ClientMessage m where m.id = :id")
    Optional<ClientMessage> findByIdForUpdate(@Param("id") UUID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from ClientMessage m where m.status = :status and m.nextAttemptAt <= :now order by m.createdAt")
    List<ClientMessage> findEligibleForPublication(@Param("status") MessageStatus status,
                                                   @Param("now") LocalDateTime now,
                                                   Pageable pageable);

}
