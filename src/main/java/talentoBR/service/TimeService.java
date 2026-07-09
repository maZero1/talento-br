package talentoBR.service;

import talentoBR.model.Clube;
import talentoBR.model.Time;
import talentoBR.repository.TimeRepository;
import talentoBR.security.AuthenticatedUserProvider;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TimeService {
    private final TimeRepository timeRepository;
    private final AuthenticatedUserProvider usuarioAtualProvider;

    public TimeService(TimeRepository timeRepository, AuthenticatedUserProvider usuarioAtualProvider) {
        this.timeRepository = timeRepository;
        this.usuarioAtualProvider = usuarioAtualProvider;
    }

    public List<Time> listarPorClube(UUID clubeId) {
        return timeRepository.findByClubeId(clubeId);
    }

    public Time buscarPorId(UUID id) {
        return timeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Time não encontrado: " + id));
    }

    public Time criar(Time time) {
        Clube clube = usuarioAtualProvider.getUsuarioAtual().getClube();
        time.setClube(clube);
        return timeRepository.save(time);
    }

    public Time atualizar(UUID id, Time dados) {
        Time existente = buscarPorId(id);
        usuarioAtualProvider.validarPropriedade(existente.getClube());
        existente.setNome(dados.getNome());
        existente.setTecnico(dados.getTecnico());
        existente.setModalidade(dados.getModalidade());
        existente.setDescricao(dados.getDescricao());
        return timeRepository.save(existente);
    }

    public void deletar(UUID id) {
        Time existente = buscarPorId(id);
        usuarioAtualProvider.validarPropriedade(existente.getClube());
        timeRepository.delete(existente);
    }

    public void validarPropriedadePublica(Clube clube) {
        usuarioAtualProvider.validarPropriedade(clube);
    }
}