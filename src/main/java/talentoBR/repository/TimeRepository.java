package talentoBR.repository;

import talentoBR.model.Time;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TimeRepository extends JpaRepository<Time, UUID> {
    List<Time> findByClubeId(UUID clubeId);
}
