package talentoBR.repository;

import talentoBR.model.Atleta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AtletaRepository extends JpaRepository<Atleta, UUID> {
    List<Atleta> findByTimeId(UUID timeId);
    List<Atleta> findByClubeId(UUID clubeId);
}


