package talentoBR.controller;

import talentoBR.model.Atleta;
import talentoBR.service.AtletaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/atletas")
public class AtletaController {
    private final AtletaService atletaService;

    public AtletaController(AtletaService atletaService) {
        this.atletaService = atletaService;
    }

    @GetMapping
    public List<Atleta> listar(@RequestParam(required = false) UUID timeId,
                                @RequestParam(required = false) UUID clubeId) {
        if (timeId != null) return atletaService.listarPorTime(timeId);
        if (clubeId != null) return atletaService.listarPorClube(clubeId);
        throw new RuntimeException("Informe timeId ou clubeId");
    }

    @GetMapping("/{id}")
    public Atleta buscar(@PathVariable UUID id) { return atletaService.buscarPorId(id); }

    @PostMapping
    public Atleta criar(@RequestParam UUID timeId, @RequestBody Atleta atleta) {
        return atletaService.criar(timeId, atleta); // sem clubeId no request
    }

    @PutMapping("/{id}")
    public Atleta atualizar(@PathVariable UUID id, @RequestBody Atleta atleta) {
        return atletaService.atualizar(id, atleta);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable UUID id) { atletaService.deletar(id); }
}