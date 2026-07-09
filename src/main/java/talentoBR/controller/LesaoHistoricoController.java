package talentoBR.controller;

import talentoBR.model.LesaoHistorico;
import talentoBR.service.LesaoHistoricoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lesoes")
public class LesaoHistoricoController {
    private final LesaoHistoricoService lesaoHistoricoService;

    public LesaoHistoricoController(LesaoHistoricoService lesaoHistoricoService) {
        this.lesaoHistoricoService = lesaoHistoricoService;
    }

    @GetMapping
    public List<LesaoHistorico> listarPorAtleta(@RequestParam UUID atletaId) {
        return lesaoHistoricoService.listarPorAtleta(atletaId);
    }

    @PostMapping
    public LesaoHistorico criar(@RequestParam UUID atletaId, @RequestBody LesaoHistorico lesao) {
        return lesaoHistoricoService.criar(atletaId, lesao);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable UUID id) { lesaoHistoricoService.deletar(id); }
}