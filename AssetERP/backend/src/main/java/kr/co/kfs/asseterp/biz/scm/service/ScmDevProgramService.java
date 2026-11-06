package kr.co.kfs.asseterp.biz.scm.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.scm.dto.DevProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.DevProgramSaveReq;
import kr.co.kfs.asseterp.biz.scm.dto.ProgramRes;
import kr.co.kfs.asseterp.biz.scm.mapper.ScmDevProgramMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

/** AS-IS Scm13_Lookup_DevProgram·Scm13_Edit_DevProgram·Scm30_Lookup_SelectMulti(EE16) → server/scm/Scm13_DevProgram(selectByDevId L27 / modelUpdate L37) · Scm30_Program(selectByTextPaging L58) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScmDevProgramService {

    private final ScmDevProgramMapper mapper;
    private final kr.co.kfs.asseterp.biz.sys.service.SysFileService sysFileService;

    public List<DevProgramRes> searchByDevId(Long devId) {
        return mapper.selectByDevId(devId);
    }

    /** AS-IS getSeq — 변경프로그램 등록: 파일을 올리려면 프로그램 번호가 먼저 있어야 한다 */
    @Transactional
    public long nextId() {
        return mapper.selectNextId();
    }

    /**
     * AS-IS Scm13_DevProgram.modelUpdate — ① scm13(개발 프로그램) 저장 ② scm30(프로그램) 저장: 등록(new)이면 같은 시스템·구분·ID의 최신 버전 + 1
     * (없으면 1, 프로그램명이 비면 전 버전 이름), 수정(edit)이면 버전 그대로 ③ 등록일시: 등록이면 지금, 수정이면 원래 값
     */
    @Transactional
    public void save(UserPrincipal user, DevProgramSaveReq req) {
        if (req.programId() == null || req.devId() == null) throw new BusinessException(ErrorCode.INVALID_INPUT, "프로그램 번호가 없습니다");
        boolean isNew = "new".equals(req.insertWay());
        long devProgramId = req.devProgramId() == null || req.devProgramId() <= 0 ? mapper.selectNextId() : req.devProgramId();
        mapper.upsertDevProgram(devProgramId, req.devId(), req.programId(), req.deployTgtYn(), req.deploySeq());

        Long version = req.version();
        String programNm = req.programNm();
        if (isNew) {
            List<ProgramRes> latest = mapper.selectByProgramCode(user.getCompanyId(), req.systemCd(), req.programType(), req.programCd().trim());
            if (latest.isEmpty()) {
                version = 1L;
            } else {
                for (ProgramRes p : latest) {
                    version = (p.version() == null ? 0 : p.version()) + 1;
                    if (programNm == null || programNm.isEmpty()) programNm = p.programNm();
                }
            }
        }
        mapper.upsertProgram(req.programId(), req.systemCd(), req.programType(), req.programCd().trim(), programNm, req.source(),
                version, user.getUserId(), req.note());
        mapper.updateRegDate(req.programId(), isNew || req.regDate() == null ? LocalDateTime.now() : req.regDate());
    }

    /** AS-IS Scm13_Grid_DevProgram.deleteRow — scm.Scm30_Program.updateUseYn(false) 뒤 scm.Scm13_DevProgram.delete (EE17) */
    @Transactional
    public void deleteDevProgram(Long devProgramId, Long programId) {
        if (programId != null) mapper.updateUseYn(programId, "false");
        mapper.deleteDevProgram(devProgramId);
    }

    /**
     * AS-IS FileUpload.uploadScm13 (mode=scm13, EE17 Scm13_Lookup_MultiUpload) — 고른 파일마다 ① 프로그램(scm30: 파일명에서 확장자를 뺀 코드,
     * 같은 시스템·구분·코드의 최신 버전 + 1, 없으면 1) ② 개발 프로그램(scm13, 배포대상) ③ 첨부파일(sys10_file, parentId = 프로그램번호)을 만든다.
     * 한 트랜잭션 — 하나라도 실패하면 모두 되돌린다(원본은 DB만 되돌리고 저장한 파일은 남겼다)
     */
    @Transactional
    public int multiUpload(UserPrincipal user, Long devId, boolean deployTgtYn, String systemCd, String programType, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) throw new BusinessException(ErrorCode.INVALID_INPUT, "업로드 파일 없음");
        int count = 0;
        for (MultipartFile file : files) {
            String name = file == null ? null : file.getOriginalFilename();
            if (file == null || file.isEmpty() || name == null) continue;
            int dot = name.lastIndexOf('.');
            String programCd = dot < 0 ? name : name.substring(0, dot);
            long programId = mapper.selectNextId();
            long devProgramId = mapper.selectNextId();
            long version = 1L;
            for (ProgramRes p : mapper.selectByProgramCode(user.getCompanyId(), systemCd, programType, programCd)) {
                version = (p.version() == null ? 0 : p.version()) + 1;
            }
            mapper.upsertProgram(programId, systemCd, programType, programCd, null, null, version, user.getUserId(), null);
            mapper.updateRegDate(programId, LocalDateTime.now());
            mapper.upsertDevProgram(devProgramId, devId, programId, deployTgtYn ? "true" : "false", null);
            sysFileService.upload(user, programId, null, "false", file);
            count++;
        }
        return count;
    }

    /** AS-IS Scm30_Program.selectByTextPaging + Total — 프로그램 선택 창 (페이지 행 + 전체 건수). searchText 는 '%…%' */
    public PageRes<ProgramRes> searchPrograms(String systemCode, String programType, String searchText, int offset, int limit) {
        String system = systemCode == null || systemCode.isEmpty() ? "%" : systemCode;
        String type = programType == null || programType.isEmpty() ? "%" : programType;
        String text = "%" + (searchText == null ? "" : searchText) + "%";
        return new PageRes<>(mapper.selectByTextPagingTotal(system, type, text), mapper.selectByTextPaging(system, type, text, limit, offset));
    }
}
