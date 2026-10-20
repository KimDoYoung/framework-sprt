package kr.co.kfs.asseterp.biz.dcr.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailFileRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrMailHistoryRes;
import kr.co.kfs.asseterp.biz.dcr.mapper.DcrMailHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS server/dcr/Dcr10_MailHistory.java + server/sys/Sys10_File.selectMailFileHistory (G14 Dcr10_Tab_MailHistory·Dcr10_Lookup_MailViwer) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DcrMailHistoryService {

    private final DcrMailHistoryMapper mapper;

    /** AS-IS Dcr10_MailHistory.selectBySenderEmail L64-76: 내가 보낸 메일. 제목은 "%…%"로 감싼다. mailGubun = 전체/개인메일/공용메일 */
    public List<DcrMailHistoryRes> search(UserPrincipal user, String startDate, String endDate, String titleText, Long fundId, String mailGubun) {
        return mapper.selectBySenderEmail(user.getUserId(), startDate, endDate, "%" + (titleText == null ? "" : titleText) + "%", fundId, mailGubun);
    }

    /** AS-IS Sys10_File.selectMailFileHistory L161: 메일의 첨부파일 */
    public List<DcrMailFileRes> searchFiles(UserPrincipal user, Long mailHistoryId) {
        return mapper.selectMailFileHistory(user.getUserId(), mailHistoryId);
    }
}
