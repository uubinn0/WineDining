package com.ssafy.winedining.domain.wine.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wine_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WineGroup {
    @Id
    private Long id;
}
