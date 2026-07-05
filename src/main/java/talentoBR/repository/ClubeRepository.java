package talentoBR.repository;

import talentoBR.model.Clube;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClubeRepository extends JpaRepository<Clube, Long> {

    Optional<Clube> findByNome(String nome);

    boolean existsByNome(String nome);
    
}
