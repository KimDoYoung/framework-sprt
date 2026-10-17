package kr.co.kfs.asseterp.biz.sys.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.sys.dto.ManualRes;
import kr.co.kfs.asseterp.biz.sys.dto.ManualSaveReq;
import kr.co.kfs.asseterp.biz.sys.mapper.SysManualMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS Sys95_Tab_Manual·Sys95_Tab_ManualAdmin → server/sys/Sys95_Manual (selectByText L34 / checkManualType L40 / update L49 / delete L54)
 * + FileUpload.uploadSys95 L696. 원본 SQL에 회사 조건이 없다(공개된 매뉴얼은 모든 회사가 본다). 관리(전체 조회·저장·삭제·업로드)는 sys admin만
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SysManualService {

    private final SysManualMapper mapper;
    private final SysFileService fileService;

    /** AS-IS retrieve() L145-172: manualType 기본 '%', 검색어는 클라이언트가 "%"+값+"%"로 보냈다 → 서버가 만든다. publicCheck=false(A34)는 관리자만 */
    public List<ManualRes> search(UserPrincipal user, String manualType, String searchText, boolean publicCheck) {
        if (!publicCheck) {
            requireSysAdmin(user);
        }
        String type = manualType == null || manualType.isEmpty() ? "%" : manualType;
        String like = searchText == null ? "%%" : "%" + searchText + "%";
        return mapper.selectByText(type, like, publicCheck);
    }

    /** AS-IS FileUpload.uploadSys95 L696-744: 파일마다 매뉴얼 행(공개 false)을 만들고 그 ID를 부모로 첨부를 저장. 한 트랜잭션 */
    @Transactional
    public ManualRes upload(UserPrincipal user, String manualType, MultipartFile file) {
        requireSysAdmin(user);
        if (manualType == null || manualType.isBlank() || "%".equals(manualType)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "분류를 선택한 후, 파일을 업로드해 주세요.");
        }
        Long manualId = mapper.selectNextId();
        mapper.insertManual(manualId, user.getCompanyId(), manualType);
        fileService.upload(user, manualId, null, "false", file);
        return mapper.selectById(manualId);
    }

    /** AS-IS update(UpdateDataModel): 변경 행을 UPDATE 하고 selectById로 다시 읽어 요청 순서대로 */
    @Transactional
    public List<ManualRes> update(UserPrincipal user, List<ManualSaveReq> rows) {
        requireSysAdmin(user);
        List<ManualRes> saved = new ArrayList<>();
        for (ManualSaveReq req : rows) {
            if (mapper.updateManual(req) == 0) {
                throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
            }
            saved.add(mapper.selectById(req.manualId()));
        }
        return saved;
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수. 첨부 삭제는 화면이 파일 API로 먼저 한다 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        requireSysAdmin(user);
        return ids == null || ids.isEmpty() ? 0 : mapper.deleteManuals(ids);
    }

    /** AS-IS checkManualType L40-47: 로그인 회사에서 쓰는 분류면 실패 */
    public void checkManualType(UserPrincipal user, String manualType) {
        if (mapper.checkManualType(user.getCompanyId(), manualType) != 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "사용중인 코드는 삭제 불가합니다");
        }
    }

    private static void requireSysAdmin(UserPrincipal user) {
        if (!user.isSysAdmin()) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }
    }
}
