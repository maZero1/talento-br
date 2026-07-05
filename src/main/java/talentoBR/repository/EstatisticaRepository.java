package talentoBR.repository;

import talentoBR.model.Estatistica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface EstatisticaRepository extends JpaRepository<Estatistica, UUID> {
    List<Estatistica> findByAtletaId(UUID atletaId);
}
