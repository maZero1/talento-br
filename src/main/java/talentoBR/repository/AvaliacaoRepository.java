package talentoBR.repository;

import talentoBR.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, UUID> {
    List<Avaliacao> findByAtletaId(UUID atletaId);
    List<Avaliacao> findByAvaliadorId(Long avaliadorId);
}
