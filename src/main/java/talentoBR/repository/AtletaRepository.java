package talentoBR.repository;

import talentoBR.model.Atleta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AtletaRepository extends JpaRepository<Atleta, Long> {

    Optional<Atleta> findByNome(String nome);

    boolean existsByNome(String nome);

}

