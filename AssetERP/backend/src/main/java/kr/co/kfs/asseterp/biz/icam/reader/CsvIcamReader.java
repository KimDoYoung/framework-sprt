package kr.co.kfs.asseterp.biz.icam.reader;

import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * asseterp.icam.mode=simulator — {simulator-dir}/{icam|icam2}/{쿼리ID}.csv 를 읽는다.
 * <ul>
 *   <li>첫 줄 = 헤더(UTF-8). 쉼표 구분, 값에 쉼표·큰따옴표가 있으면 "..." (큰따옴표는 "")</li>
 *   <li>일반 열 = 결과 열(AS-IS SELECT 별칭)</li>
 *   <li>'@이름' 열 = 조건 전용 열: 같은 이름의 파라미터가 있으면 일치하는 행만 돌려준다
 *       ('%'가 있으면 LIKE처럼 비교). 결과에는 포함하지 않는다</li>
 *   <li>CSV 파일이 없으면 0행(AS-IS에서 ICAM이 빈 결과를 준 것과 같다)</li>
 * </ul>
 */
@Component
@ConditionalOnProperty(name = "asseterp.icam.mode", havingValue = "simulator")
public class CsvIcamReader implements IcamReader {

    private final Path baseDir;

    public CsvIcamReader(@Value("${asseterp.icam.simulator-dir:data/icam-simulator}") String dir) {
        this.baseDir = Path.of(dir);
    }

    @Override
    public List<IcamRow> read(IcamServer server, String queryId, Map<String, Object> params) {
        Path file = baseDir.resolve(server.dir()).resolve(queryId + ".csv");
        if (!Files.isRegularFile(file)) {
            return List.of();
        }
        List<List<String>> lines;
        try {
            lines = parse(Files.readString(file, StandardCharsets.UTF_8));
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "ICAM 시뮬레이터 CSV를 읽을 수 없습니다: " + file);
        }
        if (lines.isEmpty()) {
            return List.of();
        }
        List<String> header = lines.get(0);
        List<IcamRow> rows = new ArrayList<>();
        for (int i = 1; i < lines.size(); i++) {
            List<String> cells = lines.get(i);
            Map<String, String> result = new LinkedHashMap<>();
            boolean match = true;
            for (int c = 0; c < header.size(); c++) {
                String name = header.get(c).trim();
                String value = c < cells.size() ? cells.get(c) : "";
                if (name.startsWith("@")) {
                    Object p = params.get(name.substring(1));
                    if (p != null && !matches(String.valueOf(p), value)) {
                        match = false;
                        break;
                    }
                } else {
                    result.put(name, value);
                }
            }
            if (match) {
                rows.add(new IcamRow(result));
            }
        }
        return rows;
    }

    private static boolean matches(String param, String value) {
        if (!param.contains("%")) {
            return param.equals(value);
        }
        StringBuilder regex = new StringBuilder();
        for (String part : param.split("%", -1)) {
            if (regex.length() > 0) {
                regex.append(".*");
            }
            regex.append(Pattern.quote(part));
        }
        return Pattern.compile(regex.toString(), Pattern.DOTALL).matcher(value).matches();
    }

    /** RFC4180 정도의 CSV 분해. 빈 줄은 건너뛴다 */
    static List<List<String>> parse(String text) {
        List<List<String>> lines = new ArrayList<>();
        List<String> row = new ArrayList<>();
        StringBuilder cell = new StringBuilder();
        boolean quoted = false;
        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            if (quoted) {
                if (ch == '"') {
                    if (i + 1 < text.length() && text.charAt(i + 1) == '"') {
                        cell.append('"');
                        i++;
                    } else {
                        quoted = false;
                    }
                } else {
                    cell.append(ch);
                }
            } else if (ch == '"') {
                quoted = true;
            } else if (ch == ',') {
                row.add(cell.toString());
                cell.setLength(0);
            } else if (ch == '\n' || ch == '\r') {
                if (ch == '\r' && i + 1 < text.length() && text.charAt(i + 1) == '\n') {
                    i++;
                }
                row.add(cell.toString());
                cell.setLength(0);
                if (!(row.size() == 1 && row.get(0).isEmpty())) {
                    lines.add(row);
                }
                row = new ArrayList<>();
            } else {
                cell.append(ch);
            }
        }
        if (cell.length() > 0 || !row.isEmpty()) {
            row.add(cell.toString());
            lines.add(row);
        }
        if (!lines.isEmpty() && !lines.get(0).isEmpty() && lines.get(0).get(0).startsWith("﻿")) {
            lines.get(0).set(0, lines.get(0).get(0).substring(1));
        }
        return lines;
    }
}
