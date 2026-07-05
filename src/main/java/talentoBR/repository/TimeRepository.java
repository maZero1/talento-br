package talentoBR.repository;

import talentoBR.model.Time;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TimeRepository extends JpaRepository<Time, Long> {

    Optional<Time> findByNome(String nome);

    boolean existsByNome(String nome);


    
}
