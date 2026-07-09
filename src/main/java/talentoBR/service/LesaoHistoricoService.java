package talentoBR.service;

import talentoBR.model.LesaoHistorico;
import talentoBR.repository.LesaoHistoricoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class LesaoHistoricoService {
    private final LesaoHistoricoRepository lesaoHistoricoRepository;
    private final AtletaService atletaService;

    public LesaoHistoricoService(LesaoHistoricoRepository lesaoHistoricoRepository, AtletaService atletaService) {
        this.lesaoHistoricoRepository = lesaoHistoricoRepository;
        this.atletaService = atletaService;
    }

    public List<LesaoHistorico> listarPorAtleta(UUID atletaId) {
        return lesaoHistoricoRepository.findByAtletaId(atletaId);
    }

    public LesaoHistorico criar(UUID atletaId, LesaoHistorico lesao) {
        lesao.setAtleta(atletaService.buscarPorId(atletaId));
        return lesaoHistoricoRepository.save(lesao);
    }

    public void deletar(UUID id) {
        lesaoHistoricoRepository.deleteById(id);
    }
}