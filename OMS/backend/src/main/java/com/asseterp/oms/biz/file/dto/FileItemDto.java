package com.asseterp.oms.biz.file.dto;

import java.time.LocalDateTime;

public record FileItemDto(
        String fileId,
        String originalFilename,
        String storedFilename,
        long fileSize,
        String detectedMimeType,
        String declaredContentType,
        String uploadedBy,
        LocalDateTime uploadedAt
) {
}
