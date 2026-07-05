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

@Entity
@Table(name = "time")
@Getter @Setter @NoArgsConstructor
public class Time {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clube_id", nullable = false)
    private Clube clube;

    @Column(nullable = false)
    private String nome;

    private String tecnico;     // nome solto
    private String modalidade;

    @Column(columnDefinition = "text")
    private String descricao;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm = LocalDateTime.now();
}
