package talentoBR.service;

import talentoBR.model.Atleta;
import talentoBR.model.Avaliacao;
import talentoBR.model.User;
import talentoBR.repository.AvaliacaoRepository;
import talentoBR.security.AuthenticatedUserProvider;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AvaliacaoService {
    private final AvaliacaoRepository avaliacaoRepository;
    private final AtletaService atletaService;
    private final AuthenticatedUserProvider usuarioAtualProvider;

    public AvaliacaoService(AvaliacaoRepository avaliacaoRepository, AtletaService atletaService,
                            AuthenticatedUserProvider usuarioAtualProvider) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.atletaService = atletaService;
        this.usuarioAtualProvider = usuarioAtualProvider;
    }

    public List<Avaliacao> listarPorAtleta(UUID atletaId) {
        return avaliacaoRepository.findByAtletaId(atletaId);
    }

    public Avaliacao buscarPorId(UUID id) {
        return avaliacaoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Avaliação não encontrada: " + id));
    }

    public Avaliacao criar(UUID atletaId, Avaliacao avaliacao) {
        Atleta atleta = atletaService.buscarPorId(atletaId);
        usuarioAtualProvider.validarPropriedade(atleta.getClube());
        User avaliador = usuarioAtualProvider.getUsuarioAtual();
        avaliacao.setAtleta(atleta);
        avaliacao.setAvaliador(avaliador);
        return avaliacaoRepository.save(avaliacao);
    }

    public void deletar(UUID id) {
        Avaliacao existente = buscarPorId(id);
        usuarioAtualProvider.validarPropriedade(existente.getAtleta().getClube());
        avaliacaoRepository.delete(existente);
    }
}