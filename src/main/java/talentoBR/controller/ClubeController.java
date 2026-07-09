package talentoBR.controller;

import talentoBR.model.Clube;
import talentoBR.service.ClubeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clubes")
public class ClubeController {
    private final ClubeService clubeService;

    public ClubeController(ClubeService clubeService) {
        this.clubeService = clubeService;
    }

    @GetMapping
    public List<Clube> listar() { return clubeService.listarTodos(); }

    @GetMapping("/{id}")
    public Clube buscar(@PathVariable UUID id) { return clubeService.buscarPorId(id); }

    @PostMapping
    public Clube criar(@RequestBody Clube clube) { return clubeService.criar(clube); }

    @PutMapping("/{id}")
    public Clube atualizar(@PathVariable UUID id, @RequestBody Clube clube) {
        return clubeService.atualizar(id, clube);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable UUID id) { clubeService.deletar(id); }
}