package talentoBR.service;

import talentoBR.model.Atleta;
import talentoBR.model.Time;
import talentoBR.repository.AtletaRepository;
import talentoBR.repository.AvaliacaoRepository;
import talentoBR.repository.EstatisticaRepository;
import talentoBR.repository.LesaoHistoricoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AtletaService {
    private final AtletaRepository atletaRepository;
    private final TimeService timeService;
    private final EstatisticaRepository estatisticaRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final LesaoHistoricoRepository lesaoHistoricoRepository;

    public AtletaService(AtletaRepository atletaRepository, TimeService timeService,
                        EstatisticaRepository estatisticaRepository,
                        AvaliacaoRepository avaliacaoRepository,
                        LesaoHistoricoRepository lesaoHistoricoRepository) {
        this.atletaRepository = atletaRepository;
        this.timeService = timeService;
        this.estatisticaRepository = estatisticaRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.lesaoHistoricoRepository = lesaoHistoricoRepository;
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

        estatisticaRepository.deleteAll(estatisticaRepository.findByAtletaId(id));
        avaliacaoRepository.deleteAll(avaliacaoRepository.findByAtletaId(id));
        lesaoHistoricoRepository.deleteAll(lesaoHistoricoRepository.findByAtletaId(id));

        atletaRepository.delete(existente);
    }
}