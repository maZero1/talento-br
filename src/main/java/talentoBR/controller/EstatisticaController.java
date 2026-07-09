package talentoBR.controller;
    
import talentoBR.model.Estatistica;
import talentoBR.service.EstatisticaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/estatisticas")
public class EstatisticaController {
    private final EstatisticaService estatisticaService;

    public EstatisticaController(EstatisticaService estatisticaService) {
        this.estatisticaService = estatisticaService;
    }

    @GetMapping
    public List<Estatistica> listarPorAtleta(@RequestParam UUID atletaId) {
        return estatisticaService.listarPorAtleta(atletaId);
    }

    @PostMapping
    public Estatistica criar(@RequestParam UUID atletaId, @RequestBody Estatistica estatistica) {
        return estatisticaService.criar(atletaId, estatistica);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable UUID id) { estatisticaService.deletar(id); }
}