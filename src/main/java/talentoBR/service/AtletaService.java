package talentoBR.service;

import talentoBR.model.Atleta;
import talentoBR.model.Time;
import talentoBR.repository.AtletaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AtletaService {
    private final AtletaRepository atletaRepository;
    private final TimeService timeService;

    public AtletaService(AtletaRepository atletaRepository, TimeService timeService) {
        this.atletaRepository = atletaRepository;
        this.timeService = timeService;
    }

    public List<Atleta> listarPorTime(UUID timeId) {
        return atletaRepository.findByTimeId(timeId);
    }

    public List<Atleta> listarPorClube(UUID clubeId) {
        return atletaRepository.findByClubeId(clubeId);
    }

    public Atleta buscarPorId(UUID id) {
        return atletaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Atleta não encontrado: " + id));
    }

    public Atleta criar(UUID timeId, Atleta atleta) {
        Time time = timeService.buscarPorId(timeId);
        timeService.validarPropriedadePublica(time.getClube());
        atleta.setTime(time);
        atleta.setClube(time.getClube());
        return atletaRepository.save(atleta);
    }

    public Atleta atualizar(UUID id, Atleta dados) {
        Atleta existente = buscarPorId(id);
        timeService.validarPropriedadePublica(existente.getClube());
        existente.setNome(dados.getNome());
        existente.setDescricao(dados.getDescricao());
        existente.setIdade(dados.getIdade());
        existente.setPosicao(dados.getPosicao());
        existente.setAltura(dados.getAltura());
        existente.setPeso(dados.getPeso());
        existente.setRating(dados.getRating());
        existente.setEstadoForma(dados.getEstadoForma());
        existente.setFotoBase64(dados.getFotoBase64());
        return atletaRepository.save(existente);
    }

    public void deletar(UUID id) {
        Atleta existente = buscarPorId(id);
        timeService.validarPropriedadePublica(existente.getClube());
        atletaRepository.delete(existente);
    }
}