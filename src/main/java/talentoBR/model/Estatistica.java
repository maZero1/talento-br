package talentoBR.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Entity
@Table(name = "estatistica")
@Getter @Setter @NoArgsConstructor
public class Estatistica {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atleta_id", nullable = false)
    private Atleta atleta;

    private Integer gols;
    private Integer assistencias;
    private Integer desarmes;
    private Integer passesOk;
    private Integer passesMal;
    private Integer chutesGol;
    private Integer driblesOk;
    private Integer bolasPerdidas;
    private Integer pontos;
    private Integer aces;
    private Integer bloqueios;
    private Integer erros;

    @Column(name = "data_partida")
    private LocalDate dataPartida;

    @Column(name = "tempo_jogo_min")
    private Integer tempoJogoMin;

}
