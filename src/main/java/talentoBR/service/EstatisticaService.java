// service/EstatisticaService.java
package talentoBR.service;

import talentoBR.model.Estatistica;
import talentoBR.repository.EstatisticaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EstatisticaService {
    private final EstatisticaRepository estatisticaRepository;
    private final AtletaService atletaService;

    public EstatisticaService(EstatisticaRepository estatisticaRepository, AtletaService atletaService) {
        this.estatisticaRepository = estatisticaRepository;
        this.atletaService = atletaService;
    }

    public List<Estatistica> listarPorAtleta(UUID atletaId) {
        return estatisticaRepository.findByAtletaId(atletaId);
    }

    public Estatistica criar(UUID atletaId, Estatistica estatistica) {
        estatistica.setAtleta(atletaService.buscarPorId(atletaId));
        return estatisticaRepository.save(estatistica);
    }

    public void deletar(UUID id) {
        estatisticaRepository.deleteById(id);
    }
}