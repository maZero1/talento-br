// service/ClubeService.java
package talentoBR.service;

import talentoBR.model.Clube;
import talentoBR.repository.ClubeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ClubeService {
    private final ClubeRepository clubeRepository;

    public ClubeService(ClubeRepository clubeRepository) {
        this.clubeRepository = clubeRepository;
    }

    public List<Clube> listarTodos() {
        return clubeRepository.findAll();
    }

    public Clube buscarPorId(UUID id) {
        return clubeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Clube não encontrado: " + id));
    }

    public Clube criar(Clube clube) {
        return clubeRepository.save(clube);
    }

    public Clube atualizar(UUID id, Clube dados) {
        Clube existente = buscarPorId(id);
        existente.setNome(dados.getNome());
        return clubeRepository.save(existente);
    }

    public void deletar(UUID id) {
        clubeRepository.delete(buscarPorId(id));
    }
}