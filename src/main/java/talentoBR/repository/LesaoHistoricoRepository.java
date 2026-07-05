package talentoBR.repository;

import talentoBR.model.LesaoHistorico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface LesaoHistoricoRepository extends JpaRepository<LesaoHistorico, UUID> {
    List<LesaoHistorico> findByAtletaId(UUID atletaId);
}
