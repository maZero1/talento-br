package talentoBR.repository;

import talentoBR.model.Clube;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ClubeRepository extends JpaRepository<Clube, UUID> {

    Optional<Clube> findByNome(String nome);

    boolean existsByNome(String nome);

}
