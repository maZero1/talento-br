package talentoBR.controller;

import talentoBR.model.Avaliacao;
import talentoBR.service.AvaliacaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {
    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @GetMapping
    public List<Avaliacao> listarPorAtleta(@RequestParam UUID atletaId) {
        return avaliacaoService.listarPorAtleta(atletaId);
    }

    @PostMapping
    public Avaliacao criar(@RequestParam UUID atletaId, @RequestBody Avaliacao avaliacao) {
        return avaliacaoService.criar(atletaId, avaliacao); // sem avaliadorId no request
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable UUID id) { avaliacaoService.deletar(id); }
}