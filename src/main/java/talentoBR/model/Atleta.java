package talentoBR.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import java.time.LocalDateTime;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "atleta")
@Getter @Setter @NoArgsConstructor
public class Atleta {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clube_id", nullable = false)
    private Clube clube;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_id", nullable = false)
    private Time time;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "text")
    private String descricao;

    private Integer idade;
    private String posicao;
    private BigDecimal altura;
    private BigDecimal peso;
    private BigDecimal rating;

    @Column(name = "estado_forma")
    private String estadoForma;

    @Column(name = "foto_base64", columnDefinition = "text")
    private String fotoBase64;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
}