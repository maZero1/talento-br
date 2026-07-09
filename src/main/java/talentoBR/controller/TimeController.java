package talentoBR.controller;

import talentoBR.model.Time;
import talentoBR.service.TimeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/times")
public class TimeController {
    private final TimeService timeService;

    public TimeController(TimeService timeService) {
        this.timeService = timeService;
    }

    @GetMapping
    public List<Time> listarPorClube(@RequestParam UUID clubeId) {
        return timeService.listarPorClube(clubeId);
    }

    @GetMapping("/{id}")
    public Time buscar(@PathVariable UUID id) { return timeService.buscarPorId(id); }

    @PostMapping
    public Time criar(@RequestBody Time time) {
        return timeService.criar(time);
    }

    @PutMapping("/{id}")
    public Time atualizar(@PathVariable UUID id, @RequestBody Time time) {
        return timeService.atualizar(id, time);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable UUID id) { timeService.deletar(id); }
}