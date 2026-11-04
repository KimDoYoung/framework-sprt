package kr.co.kfs.asseterp.biz.batch;

import kr.co.kfs.asseterp.biz.batch.action.FileMissingAction;
import kr.co.kfs.asseterp.biz.batch.dto.BatchFileRow;
import kr.co.kfs.asseterp.biz.batch.dto.BatchReq;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFileMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class FileMissingActionTest {

    private final BatchFileMapper mapper = mock(BatchFileMapper.class);
    private static BatchReq year(String y) {
        return new BatchReq(null, null, null, null, null, null, null, y, null);
    }

    @Test
    void 파일이_있으면_통과하고_없으면_세어도_결과_문구는_같다(@TempDir Path dir) throws IOException {
        Files.writeString(dir.resolve("101"), "x");   // 실제 파일은 {serverPath}/{fileId}
        when(mapper.selectByYear("2026")).thenReturn(List.of(
                new BatchFileRow(101L, dir.toString(), 1.0),
                new BatchFileRow(102L, dir.toString(), 2.0)));

        String msg = new FileMissingAction(mapper).run(year("2026"));

        assertThat(msg).isEqualTo("filemissing 작업완료");
        verify(mapper).selectByYear("2026");
    }

    @Test
    void 연도가_없으면_AS_IS처럼_그대로_조회한다() {
        when(mapper.selectByYear(null)).thenReturn(List.of());

        assertThat(new FileMissingAction(mapper).run(year(null))).isEqualTo("filemissing 작업완료");
        verify(mapper).selectByYear(null);
    }
}
