package talentoBR.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "avaliacao")
@Getter @Setter @NoArgsConstructor
public class Avaliacao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atleta_id", nullable = false)
    private Atleta atleta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avaliador_id", nullable = false) // agora bigint
    private User avaliador;

    @Column(name = "nota_tecnica")
    private BigDecimal notaTecnica;

    @Column(name = "nota_tatica")
    private BigDecimal notaTatica;

    @Column(name = "nota_fisica")
    private BigDecimal notaFisica;

    @Column(name = "nota_geral")
    private BigDecimal notaGeral;

    @Column(columnDefinition = "text")
    private String parecer;

    @Column(name = "data_avaliacao")
    private LocalDate dataAvaliacao = LocalDate.now();
}
