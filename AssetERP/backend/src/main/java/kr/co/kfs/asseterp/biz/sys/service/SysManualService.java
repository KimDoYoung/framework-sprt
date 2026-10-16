package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.sys.dto.ManualRes;
import kr.co.kfs.asseterp.biz.sys.mapper.SysManualMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Sys95_Tab_Manual → server/sys/Sys95_Manual.selectByText L34. 원본 SQL에 회사 조건이 없다(공개된 매뉴얼은 모든 회사가 본다) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysManualService {

    private final SysManualMapper mapper;

    /** AS-IS retrieve() L145-172: manualType 기본 '%', 검색어는 클라이언트가 "%"+값+"%"로 보냈다 → 서버가 만든다 */
    public List<ManualRes> search(String manualType, String searchText) {
        String type = manualType == null || manualType.isEmpty() ? "%" : manualType;
        String like = searchText == null ? "%%" : "%" + searchText + "%";
        return mapper.selectByText(type, like);
    }
}
